import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Route } from 'react-router-dom';
import {
  updateSearchQuery,
  fetchCVSearchAutosuggestOptions,
  fetchVacancySearchAutosuggestOptions,
} from '../../../actions/searchActions';

import {
  fetchPositions
} from '../../../actions/cvActions';

import Headroom from 'react-headroom';
import Button from '../../forms/Button';
import HeaderUserBox from '../HeaderUserBox';
import HeaderNotificationBox from '../HeaderNotificationBox';
import Select from '../../forms/Select';
import TextInput from '../../forms/TextInput';
import Dropdown from '../../forms/Dropdown';

import s from './HeaderPanel.css';

const searchTypes = {
  CV: 'cv',
  VACANCY: 'vacancy'
};

class HeaderPanel extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchType: props.user && props.user.role == 'jobseeker' ? searchTypes.VACANCY : searchTypes.CV,
      q: '',
    }

    this._handleSearchSubmit = this._handleSearchSubmit.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  componentWillMount(){
    if(this.props.searchQuery){
      const searchType = this.props.searchQuery.type || this.state.searchType;
      const q = decodeURIComponent(this.props.searchQuery.q || '');
      this.setState({
        searchType,
        q
      });
      if(searchType == 'cv') {
        this.props.fetchCVSearchAutosuggestOptions(q);
      } else if(searchType == 'vacancy') {
        this.props.fetchVacancySearchAutosuggestOptions(q);
      }
    }
  }

  _handleSearchSubmit(history){
    this.props.updateSearchQuery({
      type: this.state.searchType,
      q: this.state.q
    });
    history.push(`/search/?type=${this.state.searchType}&q=${this.state.q}`);
  }

  _handleSearchTypeChange(){
    const { searchType } = this.state;
    const type = searchType == searchTypes.CV ? searchTypes.VACANCY : searchTypes.CV
    this.setState({ searchType: type });
  }

  // componentWillReceiveProps(newProps) {
  //   if(newProps.searchQuery){
  //     this.setState({
  //       searchType: newProps.searchQuery.type || this.state.searchType,
  //       q: decodeURIComponent(newProps.searchQuery.q || '')
  //     });
  //   }
  // }

  _handleKeyPress(e, history) {
    if(e.key == 'Enter'){
        this._handleSearchSubmit(history);
    }
  }

  _handleSearchQueryChange(e){
    const q = e.target.value;
    const { searchType } = this.state;
    this.setState({q});
    if(searchType == 'cv') {
      this.props.fetchCVSearchAutosuggestOptions(q);
    } else if(searchType == 'vacancy') {
      this.props.fetchVacancySearchAutosuggestOptions(q);
    }
  }

  render(){
    const { searchType } = this.state;
    const user = this.props.user || {};
    return (

        <Headroom disableInlineStyles={true}>
            <div className={s.headerPanel}>
              <div className={s.searchBox}>
                <div
                  className={s.searchTypeBox}
                  onClick={this._handleSearchTypeChange.bind(this)}
                >
                  <i className='icon-search'/>
                  <p>
                    <a className={s.toggleLink}>
                      { searchType == searchTypes.VACANCY &&
                        gettext('Вакансії')
                      }
                      { searchType == searchTypes.CV &&
                        gettext('Резюме')
                      }
                      &nbsp;<i className='icon-angle-down' />
                    </a>
                  </p>
                </div>
                <Route render={({history}) => (
                    <TextInput
                      className={s.searchInput}
                      value={this.state.q}
                      handleChange={this._handleSearchQueryChange.bind(this)}
                      placeholder={ gettext('кухар, слюсар, сантехнiк') }
                      handleEnterPressed={e => this._handleKeyPress(e, history)}
                      autosuggest={true}
                      options={ this.state.q.length == 1 ? [] : this.props.searchAutosuggestOptions }
                      handleOptionSelect={ val => this.setState({q: val.label}) }
                    />
                  )}
                />
              </div>
              <div className='searchBox_right'>
                <Route render={({history}) => (
                    <Button
                      label={ gettext('Шукати') }
                      className={'default_button ' + s.searchButton + ' ' + (!this.state.q && s.hidden)}
                      handleClick={e => {this._handleSearchSubmit(history)}}
                    />
                  )}
                  />
                <div className={s.notificationBox}>
                  <i
                    className={'icon-paper-plane-empty ' + s.serviceIcon + ' ' + s.withBubble }
                  />
                  <HeaderNotificationBox />
                </div>
                <HeaderUserBox user={user} />
              </div>
            </div>
        </Headroom>
    )
  }
}
function mapStateToProps(state) {
  return {
    searchQuery: state.searchQuery,
    searchAutosuggestOptions: state.searchAutosuggestOptions,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSearchQuery,
    fetchPositions,
    fetchCVSearchAutosuggestOptions,
    fetchVacancySearchAutosuggestOptions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderPanel);


// <input
//   type='text'
//   className={s.searchInput}
//   value={this.state.q}
//   onChange={e => this.setState({q: e.target.value})}
//   placeholder={ gettext('кухар, слюсар, сантехнiк') }
//   onKeyPress={e => this._handleKeyPress(e, history)}
// />


// <Select
//   name='search_query'
//   className={s.searchInput}
//   value={{value: this.state.q, label: this.state.q}}
//   handleChange={val =>  { this.setState({q: val.label}) }}
//   handleInputChange={this._handleSearchQueryChange.bind(this)}
//   placeholder={ gettext('кухар, слюсар, сантехнiк') }
//   options={this.props.positions}
//   noResultsText={''}
// />
