import CreatorSurveyAnalyticsPage from "@/components/pages/creator/surveys/CreatorSurveyAnalyticsPage";

type CreatorSurveyAnalyticsRouteProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function CreatorSurveyAnalyticsRoute({
  params,
}: CreatorSurveyAnalyticsRouteProps) {
  const { surveyId } = await params;

  return <CreatorSurveyAnalyticsPage surveyId={surveyId} />;
}
