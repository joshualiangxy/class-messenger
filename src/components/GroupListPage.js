import React, { useState } from 'react';
import AddGroupModal from './AddGroupModal';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const GroupListPage = ({ groups }) => {
  const [open, setOpen] = useState(false);

  const onRequestClose = () => {
    setOpen(false);
  };

  const openNewGroup = () => {
    setOpen(true);
  };

  return (
    <div>
      <h1>GroupListPage</h1>
      <button onClick={openNewGroup}>Add New Group</button>
      <button onClick={() => console.log(groups)}>log groups</button>
      {
        // TODO: make this into an actual list with link
        groups.map(group => {
          const gid = group.gid;
          const name = group.name;
          return (
            <div key={gid}>
              <Link to={`/groups/${gid}`}>
                <h2>{name}</h2>
              </Link>
            </div>
          );
        })
      }
      <AddGroupModal isOpen={open} onRequestClose={onRequestClose} />
    </div>
  );
};

const mapStateToProps = state => ({ groups: state.groups });

export default connect(mapStateToProps)(GroupListPage);
