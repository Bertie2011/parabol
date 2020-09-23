import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {QueryRenderer} from 'react-relay'
import useAtmosphere from '~/hooks/useAtmosphere'
import useDocumentTitle from '~/hooks/useDocumentTitle'
import TeamArchive from '~/modules/teamDashboard/components/TeamArchive/TeamArchive'
import UserTasksHeader from '~/modules/userDashboard/components/UserTasksHeader/UserTasksHeader'
import ErrorComponent from './ErrorComponent/ErrorComponent'


const query = graphql`
  query ArchiveTaskRootQuery($first: Int!, $after: DateTime, $userIds: [ID!], $teamIds: [ID!]) {
    viewer {
      ...UserTasksHeader_viewer
      ...TeamArchive_viewer
    }
  }
`

const renderQuery = ({error, props}) => {
  if (error) {
    return <ErrorComponent error={error} eventId={''} />
  }
  if (!props) {
    return <UserTasksHeader viewer={null} />
  }
  return (
    <>
      <UserTasksHeader viewer={props.viewer} />
      <TeamArchive viewer={props?.viewer ?? null} returnToTeamId={props?.returnToTeamId} team={props?.team} />
    </>
  )
}

export interface ArchiveTaskRootProps {
  teamIds?: string[] | null
  userIds?: string[] | null
  team?: any | null
  returnToTeamId?: string
}

const ArchiveTaskRoot = ({teamIds, team, userIds, returnToTeamId}: ArchiveTaskRootProps) => {
  const atmosphere = useAtmosphere()
  returnToTeamId && useDocumentTitle(`Team Archive | ${team.name}`, 'Archive')

  return (
    <QueryRenderer
      environment={atmosphere}
      query={query}
      variables={{teamIds, userIds, first: 10}}
      fetchPolicy={'store-or-network' as any}
      render={renderQuery}
    />
  )
}

export default ArchiveTaskRoot
