import { useParticipantsQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, isItMe, isNextDay } from '@/utils';
import { Avatar, Tooltip } from '@nextui-org/react';
import { FaCrown } from 'react-icons/fa6';
import { UserTypeFromTable } from '@/types/userTypes';
import AvatarDefault from '@/utils/icons/AvatarDefault';
import ChatImg from './ChatImg';

const OthersChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  const { chatRoomId, messages } = chatStore((state) => state);
  const room = useRoomDataQuery(chatRoomId as string);
  const roomId = room?.roomId;
  const leaderId = room?.roomData.leader_id;
  const participants = useParticipantsQuery(roomId as string);

  const showThatUser = (userId: string | null) => {
    const thatUserData = participants?.find((p) => p.user_id === userId);
    return thatUserData;
  };

  return (
    <div>
      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-[12px]">
        {isItMe(idx, messages) ? (
          !isNextDay(idx, messages) ? (
            <div className="w-[60px]"></div>
          ) : (
            <ParticipantsInfoWrapper
              participants={participants}
              showThatUser={showThatUser}
              msg={msg}
              leaderId={leaderId}
            />
          )
        ) : (
          <ParticipantsInfoWrapper
            participants={participants}
            showThatUser={showThatUser}
            msg={msg}
            leaderId={leaderId}
          />
        )}

        <div className="flex flex-col gap-1">
          {isItMe(idx, messages) ? (
            !isNextDay(idx, messages) ? null : (
              <div className="font-bold">{showThatUser(msg.send_from)?.nickname}</div>
            )
          ) : (
            <div className="font-bold">{showThatUser(msg.send_from)?.nickname}</div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="gap-2 mr-auto">
              {msg.message?.length ? (
                <div className="rounded-md bg-mainColor py-1.5 px-[8px] text-right text-white font-extralight">
                  {msg.message}
                </div>
              ) : null}
              <ChatImg msg={msg} />
            </div>
            {idx < messages.length - 1 && msg.send_from === messages[idx + 1].send_from ? null : (
              <div className="mt-auto text-xs text-gray-400">
                <p>{getformattedDate(msg.created_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersChat;

const ParticipantsInfoWrapper = ({
  participants,
  showThatUser,
  msg,
  leaderId
}: {
  participants: UserTypeFromTable[];
  showThatUser: any;
  msg: Message;
  leaderId: string | undefined;
}) => {
  return (
    <Tooltip content={<div>{participants && showThatUser(msg.send_from)?.nickname}</div>}>
      <div className="relative my-auto flex h-[60px] w-[60px] ">
        <div className="h-16 w-16 ml-auto flex justify-center items-center">
          {showThatUser(msg.send_from)?.avatar ? (
            <Avatar
              src={showThatUser(msg.send_from)?.avatar as string}
              alt="Avatar"
              className="transition-transform w-14 h-14"
            />
          ) : (
            <AvatarDefault />
          )}
        </div>
        {leaderId === showThatUser(msg.send_from) ? (
          <div className="w-6 h-6 rounded-full absolute bottom-0 right-0 flex justify-center bg-purpleThird border border-gray1 font-extralight">
            <FaCrown className="my-auto fill-mainColor " />
          </div>
        ) : null}
      </div>
    </Tooltip>
  );
};
