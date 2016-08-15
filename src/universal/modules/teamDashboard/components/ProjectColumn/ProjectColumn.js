import React, {PropTypes} from 'react';
import look, {StyleSheet} from 'react-look';
import theme from 'universal/styles/theme';
import TeamCard from 'universal/modules/teamDashboard/components/TeamCard/TeamCard';
import {ACTIVE, STUCK, DONE, FUTURE, PROJECT} from 'universal/utils/constants';
import FontAwesome from 'react-fontawesome';
import {cashay} from 'cashay';
import shortid from 'shortid';
import getNextSort from 'universal/utils/getNextSort';

const borderColor = 'rgba(0, 0, 0, .1)';
let styles = {};

const labels = {
  [ACTIVE]: 'Active',
  [STUCK]: 'Stuck',
  [DONE]: 'Done',
  [FUTURE]: 'Future'
};

const ProjectColumn = (props) => {
  const {dispatch, editing, status, projects, teamMembers, teamMemberId} = props;
  // teamMemberId format is 'userId::teamId'
  const [, teamId] = teamMemberId.split('::');
  const handleAddProject = () => {
    const newTask = {
      id: `${teamId}::${shortid.generate()}`,
      type: PROJECT,
      status,
      teamMemberId,
      teamSort: getNextSort(projects, 'teamSort'),
      // put it at the top of the list, make em sort it if they don't like it
      userSort: 0
    };
    cashay.mutate('createTask', {variables: {newTask}});
  };
  return (
    <div className={styles.column}>
      <div className={styles.columnHeading}>
        <span>{labels[status]}</span>
        <FontAwesome name="plus-square" onClick={handleAddProject}/>
      </div>
      {projects.map(project =>
        <TeamCard
          key={`teamCard${project.id}`}
          dispatch={dispatch}
          editing={editing}
          teamId={teamId}
          teamMemberId={teamMemberId}
          teamMembers={teamMembers}
          project={project}
        />)
      }
    </div>
  );
};

ProjectColumn.propTypes = {
  dispatch: PropTypes.func.isRequired,
  editing: PropTypes.object,
  projects: PropTypes.array,
  status: PropTypes.string,
  teamMembers: PropTypes.array,
  teamMemberId: PropTypes.string
};

const columnStyles = {
  flex: 1,
  width: '25%'
};

styles = StyleSheet.create({
  root: {
    borderTop: `1px solid ${borderColor}`,
    margin: '1rem 0',
    width: '100%'
  },

  columns: {
    display: 'flex !important',
    maxWidth: '80rem',
    width: '100%'
  },

  columnFirst: {
    ...columnStyles,
    padding: '1rem 1rem 0 0'
  },

  column: {
    ...columnStyles,
    borderLeft: `1px solid ${borderColor}`,
    padding: '1rem 1rem 0'
  },

  columnLast: {
    ...columnStyles,
    borderLeft: `1px solid ${borderColor}`,
    padding: '1rem 0 0 1rem',
  },

  columnHeading: {
    color: theme.palette.dark,
    fontWeight: 700,
    margin: '0 0 1rem'
  }
});

export default look(ProjectColumn);
