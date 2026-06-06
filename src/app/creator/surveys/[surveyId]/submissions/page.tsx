import CreatorSurveySubmissionsPage from "@/components/pages/creator/surveys/CreatorSurveySubmissionsPage";

type CreatorSurveySubmissionsRouteProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function CreatorSurveySubmissionsRoute({
  params,
}: CreatorSurveySubmissionsRouteProps) {
  const { surveyId } = await params;

  return <CreatorSurveySubmissionsPage surveyId={surveyId} />;
}
