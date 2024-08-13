import LeftSide from './leftSide';
import RightSideFriendsOnly from './rightSideFriends';

export default function Home() {
  return (
    <>
      <div className="flex-1 flex flex-col h-[96.3vh] px-4 pb-4 break-words"></div>
      <RightSideFriendsOnly />
    </>
  );
}
