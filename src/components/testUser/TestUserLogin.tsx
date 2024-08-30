import { useModalStore } from '@/store/modalStore';
import { IsValidateShow, LoginDataType } from '@/types/userTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { customErrToast } from '../common/customToast';

const TestUserLogin = () => {
  const [loginData, setLoginData] = useState<LoginDataType>({ userId: '', password: '' });
  const [isError, setIsError] = useState(false);
  const [checkRememberId, setCheckRememberId] = useState(false);
  const { openModal } = useModalStore();

  const [isValidateShow, setIsValidateShow] = useState<IsValidateShow>({
    userId: true,
    password: true
  });
  const saveUserId = cookie.load('rememberUserId');

  useEffect(() => {
    if (saveUserId) {
      setLoginData((prev) => ({ ...prev, userId: saveUserId }));
      setCheckRememberId(true);
    }
  }, [saveUserId]);

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const {
        data: { session },
        error
      } = await clientSupabase.auth.signInWithPassword({
        email: 'test@test.com',
        password: '123456'
      });
      if (session) {
        // 쿠키에 아이디 저장
        if (checkRememberId) {
          cookie.save('rememberUserId', 'test20@test.com', { path: '/' });
          console.log('쿠키저장');
        } else {
          cookie.remove('rememberUserId', { path: '/' });
        }
        showModal();
      } else if (error) throw error;
    } catch (error: any) {
      if (error.message.includes('Invalid login')) {
        customErrToast('이메일 또는 비밀번호를 확인해주세요.');
        setIsError(true);
      } else {
        customErrToast('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const showModal = () => {
    openModal({
      type: 'alert',
      name: '',
      text: '로그인 되었습니다.'
    });
  };

  return (
    <form onClick={onSubmitForm} className="bg-red-400 border-4 h-12 text-xl flex items-center justify-center">
      테스트 유저 로그인
    </form>
  );
};

export default TestUserLogin;
