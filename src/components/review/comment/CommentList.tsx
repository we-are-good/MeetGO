'use client';

import { useFetchCommentData } from '@/query/useQueries/useCommentQuery';
import CommentCard from './CommentCard';
import NewComment from './NewComment';

type Props = {
  review_id: string;
};

export type CommentListType = {
  user_id: string | null;
  comment_id: string | null;
  comment_content: string | null;
  created_at: string | null;
  review_id: string | null;
};

const CommentList = ({ review_id }: Props) => {
  const { commentData, isCommentDataLoading } = useFetchCommentData(review_id);

  const sortedData = commentData?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (isCommentDataLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="flex flex-col mb-[32px]">
      <div className="text-[18px] mb-[32px]">댓글 {commentData?.length}개</div>
      <div>
        <NewComment review_id={review_id} />
      </div>
      {sortedData?.map((comment) => (
        <div key={comment.comment_id} className="flex w-full max-w-[1000px] h-[180px] mt-[32px]">
          <CommentCard comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
