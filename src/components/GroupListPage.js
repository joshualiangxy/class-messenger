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
      <div className="page-header">
        <div className="content-container">
          <h1 className="page-header__title">Groups</h1>
          <button
            className="button button--norm page-header__actions"
            onClick={openNewGroup}
          >
            Add New Group
          </button>
        </div>
      </div>
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
