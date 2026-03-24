// "use client";

// import { useCallback, useState } from "react";
// import {
//   checkDailyPlan,
//   generatePlan,
//   getPlanByExamTaskId,
// } from "@/app/api/service/plan";
// import {
//   PlanDetailResponse,
//   PlanGenerateRequest,
//   PlanGenerateResponse,
// } from "@/types/plan";

// export default function usePlan() {
//   const [plan, setPlan] = useState<
//     PlanDetailResponse | PlanGenerateResponse | null
//   >(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleGeneratePlan = useCallback(
//     async (payload: PlanGenerateRequest) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const data = await generatePlan(payload);
//         setPlan(data);
//         return data;
//       } catch (err) {
//         console.error("학습 플랜 생성 실패:", err);
//         setError("학습 플랜 생성에 실패했습니다.");
//         return null;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [],
//   );

//   const handleFetchPlan = useCallback(async (examTaskId: number) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await getPlanByExamTaskId(examTaskId);
//       setPlan(data);
//       return data;
//     } catch (err) {
//       console.error("학습 플랜 조회 실패:", err);
//       setError("학습 플랜 조회에 실패했습니다.");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const handleCheckDailyPlan = useCallback(async (dailyPlanId: number) => {
//     try {
//       const result = await checkDailyPlan(dailyPlanId);

//       setPlan((prev) => {
//         if (!prev) return prev;

//         return {
//           ...prev,
//           weeklyPlans: prev.weeklyPlans.map((week) => ({
//             ...week,
//             dailyPlans: week.dailyPlans.map((day) =>
//               day.dailyPlanId === dailyPlanId
//                 ? {
//                     ...day,
//                     isCompleted: result.isCompleted,
//                     completed: result.isCompleted,
//                   }
//                 : day,
//             ),
//           })),
//         };
//       });

//       return result;
//     } catch (err) {
//       console.error("학습 완료 체크 실패:", err);
//       setError("완료 체크에 실패했습니다.");
//       return null;
//     }
//   }, []);

//   return {
//     plan,
//     loading,
//     error,
//     handleGeneratePlan,
//     handleFetchPlan,
//     handleCheckDailyPlan,
//     setPlan,
//   };
// }
