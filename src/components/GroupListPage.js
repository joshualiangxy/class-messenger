import React, { useState } from 'react';
import AddGroupModal from './AddGroupModal';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

export const GroupListPage = ({ groups }) => {
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
      <div className="content-container">
        {
          // Add a 'no groups' when there's no groups
          groups.length === 0 ? (
            <p className="list-header__text">No groups</p>
          ) : (
            groups.map(group => (
              <div key={group.gid} className="grouplist">
                <Link
                  className="button--link-black"
                  to={`/groups/${group.gid}`}
                >
                  <h2 className="groupitem">{group.name}</h2>
                  
                </Link>
              </div>
            ))
          )
        }
      </div>

      <AddGroupModal isOpen={open} onRequestClose={onRequestClose} />
    </div>
  );
};

const mapStateToProps = state => ({ groups: state.groups });

export default connect(mapStateToProps)(GroupListPage);
