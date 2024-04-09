import { clientSupabase } from '(@/utils/supabase/client)';
import Image from 'next/image';
import ReviewEditModal from './ReviewEditModal';
import { useRouter } from 'next/navigation';
import ReviewHeart from './ReviewHeart';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import ImageGallery from './ImageGallery';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import defaultImg from '../../../public/defaultImg.jpg';
import { userStore } from '(@/store/userStore)';
import { AUTHOR_QUERY_KEY, REVIEW_QUERY_KEY } from '(@/query/review/reviewQueryKeys)';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchAuthorData, fetchReviewData } from '(@/query/review/reviewQueryFns)';

export type ReviewDetailType = {
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  user_id: string | null;
  image_urls: string[] | null;
  show_nickname: boolean | null;
};

type Props = {
  review_id: string;
  commentCount: number;
};

const ReviewDetail = ({ review_id, commentCount }: Props) => {
  const router = useRouter();

  const { user, setUser } = userStore((state) => state);
  const userId = user && user[0].user_id;

  const useAuthorDataQuery = (review_id: string) => {
    const { data: userData } = useSuspenseQuery({
      queryKey: [AUTHOR_QUERY_KEY, review_id],
      queryFn: async () => await fetchAuthorData(review_id)
    });
    return userData;
  };

  const userData = useAuthorDataQuery(review_id);
  const authorNickname = userData?.nickname || null;
  const authorAvatar = userData?.avatar;

  const useReviewDataQuery = (review_id: string) => {
    const { data: reviewDetail } = useSuspenseQuery({
      queryKey: [REVIEW_QUERY_KEY, review_id],
      queryFn: async () => await fetchReviewData(review_id)
    });
    return reviewDetail;
  };

  const reviewDetail = useReviewDataQuery(review_id);
  const reviewTitle = reviewDetail?.review_title;
  const reviewContent = reviewDetail?.review_contents;
  const showNickname = reviewDetail?.show_nickname;
  const reviewImageUrls = reviewDetail?.image_urls;
  const reviewCreatedAt = reviewDetail?.created_at;

  const handleDeleteReview = async () => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      const { error: commentDeleteError } = await clientSupabase
        .from('review_comment')
        .delete()
        .eq('review_id', review_id);
      const { error: likeDeleteError } = await clientSupabase.from('review_like').delete().eq('review_id', review_id);
      const { error: reviewDeleteError } = await clientSupabase.from('review').delete().eq('review_id', review_id);
      if (reviewDeleteError) {
        console.log('리뷰 삭제 오류:', reviewDeleteError.message);
      } else if (commentDeleteError) {
        console.log('댓글 삭제 오류:', commentDeleteError.message);
      } else if (likeDeleteError) {
        console.log('댓글 삭제 오류:', likeDeleteError.message);
      } else {
        router.push(`/review/pageNumber/1`);
      }
    }
  };
  return (
    <div>
      <div>
        <div>{reviewTitle}</div>
        <div className="flex items-center">
          {authorAvatar ? (
            <Image className="mr-[15px] rounded-full" src={authorAvatar} alt="유저 아바타" height={50} width={50} />
          ) : (
            <AvatarDefault />
          )}
          <div>{showNickname ? authorNickname || '익명유저' : '익명유저'}</div>
        </div>
        <div className="text-[#A1A1AA]">
          {reviewCreatedAt
            ? new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              }).format(new Date(reviewCreatedAt))
            : null}
        </div>
        <div className="flex gap-1">
          <ReviewHeart review_id={review_id} />
          <div className="flex gap-1">
            <div className="pt-[2px]" style={{ fontSize: '1.1rem' }}>
              <HiOutlineChatBubbleOvalLeftEllipsis />
            </div>
            <div className="pb-1">{commentCount}</div>
          </div>
        </div>
        <div>
          {reviewImageUrls && reviewImageUrls.length > 0 ? (
            <ImageGallery images={reviewImageUrls || []} />
          ) : (
            <Image
              src={defaultImg}
              alt="reviewImage"
              height={300}
              width={300}
              className="w-[300px] h-full object-cover rounded-[10px]"
            />
          )}
        </div>
        <div>{reviewContent}</div>
      </div>
      <div>
        {userId === reviewDetail?.user_id && (
          <div>
            <ReviewEditModal review_id={review_id} />
            <button onClick={handleDeleteReview}>삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
