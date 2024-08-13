// import { validateRequest } from "@/auth";
// import prisma from "@/lib/prisma";

// export default async function POST(request: Request) {
//   const { status, userId } = await request.json();
//   if (!userId || !status) {
//     return;
//   }

//   try {
//     await prisma.user.update({
//       where: { id: userId },
//       data: { status },
//     });
//     const Pusher = require("pusher");

//     const pusher = new Pusher({
//       appId: process.env.PUSHER_APP_ID,
//       key: process.env.NEXT_PUBLIC_PUSHER_KEY,
//       secret: process.env.PUSHER_SECRET,
//       cluster: "ap1",
//       useTLS: true,
//     });

//     await prisma.user
//       .findUnique({
//         where: {
//           id: userId,
//         },
//         select: {
//           id: true,
//           discriminator: true,
//           username: true,
//           displayName: true,
//           googleId: true,
//           email: true,
//         },
//       })
//       .then((friend) => {
//         pusher.trigger(`presence${userId}`, "update", friend);
//       });
//   } catch (error) {}
// }
