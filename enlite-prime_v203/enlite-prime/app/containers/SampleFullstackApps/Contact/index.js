import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import {
  ContactList,
  ContactDetail,
  AddContact,
  Notification
} from 'enl-components';
import useStyles from 'enl-components/Contact/contact-jss';
import {
  createAction,
  updateAction,
  deleteAction,
  showDetailAction,
  hideDetailAction,
  editAction,
  addAction,
  closeAction,
  searchAction,
  closeNotifAction,
} from './reducers/contactActions';
import uploadImg from './helpers/uploadImg';

function Contact() {
  const { classes, cx } = useStyles();
  const title = brand.name + ' - Contact';
  const description = brand.desc;
  const [uploadSubmiting, setUploadSubmiting] = useState(false);

  // Redux State
  const avatarInit = useSelector(state => state.contactFullstack.avatarInit);
  const dataContact = useSelector(state => state.contactFullstack.contactList);
  const itemSelected = useSelector(state => state.contactFullstack.selectedIndex);
  const selectedId = useSelector(state => state.contactFullstack.selectedId);
  const keyword = useSelector(state => state.contactFullstack.keywordValue);
  const loading = useSelector(state => state.contactFullstack.loading);
  const open = useSelector(state => state.contactFullstack.openFrm);
  const showMobileDetail = useSelector(state => state.contactFullstack.showMobileDetail);
  const messageNotif = useSelector(state => state.contactFullstack.notifMsg);

  // Dispatcher
  const showDetail = useDispatch();
  const hideDetail = useDispatch();
  const edit = useDispatch();
  const add = useDispatch();
  const close = useDispatch();
  const create = useDispatch();
  const update = useDispatch();
  const remove = useDispatch();
  const search = useDispatch();
  const closeNotif = useDispatch();

  const submitContact = (item, avatar) => {
    let value = {};
    setUploadSubmiting(true);
    if (item.key === selectedId) { // Update contact
      const contact = dataContact[itemSelected].toJS();
      if (avatar) {
        uploadImg(avatar, async (url) => {
          value = { ...item, avatar: url || null };
          update(updateAction(contact, value));
          setUploadSubmiting(false);
        });
      } else {
        value = item;
        update(updateAction(contact, value));
        setUploadSubmiting(false);
      }
    } else { // Create new contact
      uploadImg(avatar, async (url) => {
        value = { ...item, avatar: url || null };
        create(createAction(value));
        setUploadSubmiting(false);
      });
    }
  };

  const updateFavourite = (item) => {
    const contact = dataContact[itemSelected];
    const value = item.toJS();
    value.favorited = !contact.favorited;
    update(updateAction(contact, value));
  };

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <Notification close={() => closeNotif(closeNotifAction)} message={messageNotif} />
      <div className={cx(classes.root, classes.padding)}>
        <ContactList
          addFn
          total={dataContact.length}
          addContact={() => add(addAction)}
          clippedRight
          itemSelected={itemSelected}
          dataContact={dataContact}
          showDetail={(payload) => showDetail(showDetailAction(payload))}
          search={(payload) => search(searchAction(payload))}
          keyword={keyword}
          loading={loading}
        />
        <ContactDetail
          showMobileDetail={showMobileDetail}
          hideDetail={() => hideDetail(hideDetailAction)}
          dataContact={dataContact}
          itemSelected={itemSelected}
          edit={(payload) => edit(editAction(payload))}
          remove={(payload) => remove(deleteAction(payload))}
          favorite={(payload) => updateFavourite(payload)}
          loading={loading}
        />
      </div>
      <AddContact
        addContact={() => add(addAction)}
        openForm={open}
        closeForm={() => close(closeAction)}
        submit={submitContact}
        avatarInit={avatarInit}
        processing={uploadSubmiting}
      />
    </div>
  );
}

Contact.defaultProps = {
  loading: false
};

export default Contact;
