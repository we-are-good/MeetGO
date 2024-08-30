'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import MeetingRoom from '../singleMeetingRoom/MeetingRoom';
import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import { useRoomConditionDataQuery } from '@/query/useQueries/useMeetingQuery';

export const RtBannerArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      style={{
        fontSize: '40px',
        display: 'block',
        top: '45%',
        zIndex: '15',
        opacity: '1',
        color: 'White',
        lineHeight: 1
      }}
      onClick={onClick}
    />
  );
};

export const LtBannerArrow = (props: any) => {
  const { className, onClick } = props;

  return (
    <div
      className={className}
      style={{
        fontSize: '40px',
        display: 'block',
        top: '45%',
        zIndex: '15',
        opacity: '1',
        color: 'gray',
        lineHeight: 1
      }}
      onClick={onClick}
    />
  );
};

const ParticipatingRooms = () => {
  const { data: user } = useGetUserDataQuery();
  const { myRoomData } = useRoomConditionDataQuery(String(user?.user_id));
  const filteredMyRoomList = myRoomData?.map((room) => room.room);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: filteredMyRoomList && filteredMyRoomList.length <= 3 ? filteredMyRoomList?.length : 3,
    slidesToScroll: 1,
    nextArrow: <RtBannerArrow />,
    prevArrow: <LtBannerArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section className="w-full max-w-[1280px] h-full max-h-[600px] px-auto">
      <Slider {...settings}>
        {filteredMyRoomList && filteredMyRoomList.length ? (
          filteredMyRoomList.map((room) => <div key={room?.room_id}>{room && <MeetingRoom room={room} />}</div>)
        ) : (
          <h2 className="text-[20px] lg:w-[1112px] max-sm:[22rem] text-center">
            아직 만들어진 방이 없습니다! 방을 만들어서 미팅을 시작해 보세요!
          </h2>
        )}
      </Slider>
    </section>
  );
};

export default ParticipatingRooms;
