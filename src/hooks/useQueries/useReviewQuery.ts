import {
  AUTHOR_QUERY_KEY,
  LIKED_REVIEWLIST_QUERY_KEY,
  REVIEWLIST_QUERY_KEY,
  REVIEW_QUERY_KEY
} from '(@/query/review/reviewQueryKeys)';
import { useQuery } from '@tanstack/react-query';
import {
  fetchAuthorData,
  fetchLikedReviewList,
  fetchReviewData,
  fetchReviewList
} from '(@/query/review/reviewQueryFns)';

export const useAuthorDataQuery = (review_id: string) => {
  const { data: userData } = useQuery({
    queryKey: [AUTHOR_QUERY_KEY, review_id],
    queryFn: async () => await fetchAuthorData(review_id)
  });
  return userData;
};

export const useReviewDataQuery = (review_id: string) => {
  const { data: reviewDetail } = useQuery({
    queryKey: [REVIEW_QUERY_KEY, review_id],
    queryFn: async () => await fetchReviewData(review_id)
  });
  return reviewDetail;
};

export const useLikedReviewDataQuery = () => {
  const { data: likedReviewList } = useQuery({
    queryKey: [LIKED_REVIEWLIST_QUERY_KEY],
    queryFn: async () => await fetchLikedReviewList()
  });
  return likedReviewList;
};

export const useReviewListDataQuery = () => {
  const { data: fetchReviewsData } = useQuery({
    queryKey: [REVIEWLIST_QUERY_KEY],
    queryFn: async () => await fetchReviewList()
  });
  return fetchReviewsData;
};
