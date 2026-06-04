import ParticipantSurveyResponsePage from "@/components/pages/participant/available-surveys/ParticipantSurveyResponsePage";

type ParticipantSurveyResponseRouteProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function ParticipantSurveyResponseRoute({
  params,
}: ParticipantSurveyResponseRouteProps) {
  const { surveyId } = await params;

  return <ParticipantSurveyResponsePage surveyId={surveyId} />;
}
