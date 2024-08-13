import MiddleSide from './middleSide';
import RightSide from './rightSide';
import { checkUser } from '../checkUser';
import { validateRequest } from '@/auth';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Home({ params }: PageProps) {
  const { id } = params;
  const session = await validateRequest();

  await checkUser({ session, id });

  return (
    <>
      <MiddleSide />
      <RightSide />
    </>
  );
}
