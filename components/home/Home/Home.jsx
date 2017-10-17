import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import s from './Home.css';
import HomeHeader from '../HomeHeader';
import Banner from '../Banner';
import Button from '../../forms/Button';
import Modal from '../../common/Modal';
import Login from '../Login';
import Signup from '../Signup';
import ResetPwdForm from '../ResetPwdForm';
import NewPasswordForm from '../NewPasswordForm';
import ActivationEmail from '../ActivationEmail';
import RequireEmailForm from '../RequireEmailForm';
import SocialActivationEmail from '../SocialActivationEmail';
import RequireRoleForm from '../RequireRoleForm';
import Footer from '../../common/Footer';
import {
  fetchUser
} from '../../../actions/userActions';


class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      showModal: false,
      modalType: null,
      email: null
    };
    this._toggleAuthModal = this._toggleAuthModal.bind(this);
    this._renderModalContent = this._renderModalContent.bind(this);
    this._changeModalType = this._changeModalType.bind(this);
  }

  componentWillMount(){
    this.props.fetchUser();
  }

  componentWillReceiveProps(newProps){
    const { match, user } = newProps;
    if (match.path == '/reset/:uid/:token') {
      this._toggleAuthModal({type: 'newpassword'});
    } else if (match.path == '/activation_email/:key/'){
      this._toggleAuthModal({type: 'activationEmail'});
    } else if (match.path == '/social_require_email/:backend/') {
      if (user.is_authenticated){
        history.pushState(null, null, '/');
      } else {
        this._toggleAuthModal({type: 'socialRequireEmail'});
      }
    } else if (match.path == '/social_activation_email/'){
      this._toggleAuthModal({type: 'socialActivationEmail'});
    } else if (match.path == '/social_require_role/:backend/'){
      if (user.is_authenticated){
        history.pushState(null, null, '/');
      } else {
        this._toggleAuthModal({type: 'socialRequireRole'});
      }
    }
  }

  _toggleAuthModal(options){
    document.body.classList.toggle('locked');
    this.setState({showModal: !this.state.showModal, modalType: options.type});
  }

  _changeModalType(modalType, email) {
    this.setState({modalType, email})
  }

  _renderModalContent(){
    const {modalType} = this.state;
    switch(modalType){
      case 'signup':
        return <Signup onChangeModalType={this._changeModalType} email={this.state.email} />;
      case 'reset':
        return <ResetPwdForm onChangeModalType={this._changeModalType}/>;
      case 'newpassword':
        return (
          <NewPasswordForm
            onChangeModalType={this._changeModalType}
            token={this.props.match.params.token}
            uid={this.props.match.params.uid}
          />
        );
      case 'activationEmail':
        return <ActivationEmail onChangeModalType={this._changeModalType} />;
      case 'socialRequireEmail':
        return <RequireEmailForm backend={this.props.match.params.backend} />;
      case 'socialActivationEmail':
        return <SocialActivationEmail />;
      case 'socialRequireRole':
        return <RequireRoleForm backend={this.props.match.params.backend} />;
      case 'login':
        return <Login onChangeModalType={this._changeModalType} value={this.state} />
    }
  }

  render(){
    const { showModal, modalType } = this.state;
    return (
      <div className={s.home__wrapper}>
        <HomeHeader
          openAuthModal={this._toggleAuthModal}
          user={this.props.user}
        />
        <Banner
          picture='/static/img/landing_bg.jpg'
          title={gettext('Перша українська професійна мережа з працевлаштування')}
        >
          <Button
            label={gettext('Швидко знайти роботу чи фахiвця')}
            className={s.banner_button}
            //handleClick={() => this._toggleAuthModal({type: 'signup'})}
          />
        </Banner>
        <Footer />
        <Modal
          show={ showModal }
          handleClose={ ()=>{this._toggleAuthModal(false)} }
        >
          { this._renderModalContent() }
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchUser
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
