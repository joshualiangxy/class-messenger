import React from 'react';
import { shallow } from 'enzyme';
import { GroupUserListing } from '../../components/GroupUserListing';
import groupUsers from '../fixtures/groupUsers';

const isOpen = true;
const onRequestClose = jest.fn();
const groupOne = 'one';
const groupTwo = 'two';
const users = groupUsers;
const setUsers = jest.fn((users) => true)
const admin = true;
const setAdmin = jest.fn();
const kickUserLocal = jest.fn();
const uid1 = 'testuid';
const uid2 = 'testuid2';
const kickUser = jest.fn((uid, gid) => Promise.resolve());


const wrapper = shallow(<GroupUserListing/>)