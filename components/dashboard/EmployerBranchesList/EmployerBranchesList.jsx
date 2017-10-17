import React, { Component } from 'react';
import SearchField from '../../forms/SearchField';
import FilterSelect from '../../forms/FilterSelect';
import TextInput from '../../forms/TextInput';
import FormFooter from '../../forms/FormFooter';
import LayerOpener from '../../forms/LayerOpener';
import { setAddressComponents } from '../../../utils/utils';

import s from './EmployerBranchesList.css';

export default class EmployerBranchesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showBranchForm: false,
            newBranch: {
                address: '',
                office_name: ''
            },
            filteredOffices: null,
            cityOptions: [],
            selectedCity: {value: 'all', label: gettext('Всі міста')},
            filterQuery: '',
            errors: {},
        };
        this.hasInputFocus = true;
        this.selectedAddress = '';
        this.addressComponents = {
            country: '',
            area: '',
            city: '',
            street: '',
            geo_point: ''
        };
        this.autocomplete = null;
        this.autocompleteLsr = null;

        this._renderBranchForm = this._renderBranchForm.bind(this);
        this._filterByName = this._filterByName.bind(this);
        this._filterOffices = this._filterOffices.bind(this);
    }

    componentWillMount(){
        this.props.handleFormInit(gettext('Представництва')); //pass form title to parent component
    }

    componentWillReceiveProps(newProps){
        const {peripheral_offices} = newProps.employer;
        this.setState({'errors': newProps.errors});
        if (newProps.updateBranche) {
            this.setState({showBranchForm: false, newBranch: {address: '', office_name: ''}});
        }
        if(!peripheral_offices) return;
        let cities = [];
        peripheral_offices.map(office => {
            if(office.city){
                cities.push({
                    value: office.city.toLowerCase(),
                    label: office.city.charAt(0).toUpperCase() + office.city.slice(1)
                });
            }
        });
        this.setState({cityOptions: cities});
    }

    componentWillUpdate(nextProps, nextState) {
        if (!this.state.showBranchForm && nextState.showBranchForm){
            this.hasInputFocus = true;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.showBranchForm && this.state.showBranchForm) {
            this.initAutocomplete();
        }
        if (!this.state.showBranchForm && this.autocomplete) {
            google.maps.event.removeListener(this.autocompleteLsr);
            google.maps.event.clearInstanceListeners(this.autocomplete);
        }
    }

    _handleSubmit(){
        const { newBranch } = this.state;
        if (newBranch.address == this.selectedAddress) {
            let data = {
                address: newBranch.address,
                office_name: newBranch.office_name,
                country: this.addressComponents.country,
                area: this.addressComponents.area,
                city: this.addressComponents.city,
                street: this.addressComponents.street,
                geo_point: this.addressComponents.geo_point,
            };
            this.props.handleSubmit('branches', {peripheral_office: data});
        } else if (newBranch.address) {
            this.props.handleErrors({'address': [gettext('Виберіть адресу із запропонованих варіантів')]})
        } else {
            this.props.handleSubmit('branches', {peripheral_office: newBranch});
        }
    }

    _filterByName(query, list){
        if(!query) return list;
        return list.filter(office => {
            const name = office.office_name.toLowerCase();
            return name.startsWith(query.toLowerCase());
        });
    }

    _filterByCity(selectedCity, list) {
        const option = selectedCity.value.toLowerCase();
        if(option != 'all'){
            return list.filter(office => {
                return office.city && office.city.toLowerCase() == option;
            });
        }
        return list;
    }

    _filterOffices(){
        const { filterQuery, selectedCity } = this.state;
        const { peripheral_offices } = this.props.employer;
        let filteredOffices = peripheral_offices || [];
        if(filterQuery)
            filteredOffices = this._filterByName(filterQuery, filteredOffices);
        if(selectedCity)
            filteredOffices = this._filterByCity(selectedCity, filteredOffices);
        this.setState({filteredOffices});
    }

    _renderBranchForm(){
        const { newBranch } = this.state;
        const { errors } = this.state;
        return (
            <div className={s.branchesList__subform}>
                <TextInput
                    name='office_name'
                    label={gettext("Назва представництва")}
                    value={newBranch.office_name}
                    handleChange={(e) => {this.setState({newBranch: {...newBranch, office_name: e.target.value}})}}
                    errors={errors.office_name}
                    validation={['required']}
                    handleFieldErrors={this.props.handleErrors}
                    inputRef={el => {
                        if (this.hasInputFocus && el) { el.focus(); this.hasInputFocus = false; }
                    }}
                />
                <TextInput
                  name='address'
                  id="suggest-branch-address"
                  label={gettext("Mісце знаходження")}
                  value={newBranch.address}
                  handleChange={(e) => {this.setState({newBranch: {...newBranch, address: e.target.value} })}}
                  handleEnterPressed={(e) => {this.setState({newBranch: {...newBranch, address: e.target.value} })}}
                  errors={errors.address}
                  validation={['required']}
                  handleFieldErrors={this.props.handleErrors}
                />
                <FormFooter
                    handleSubmit={this._handleSubmit.bind(this)}
                    handleCancel={(e) => {
                        this.setState({showBranchForm: false});
                    }}
                    fetching={this.props.fetching}
                />
            </div>
        );
    }

    initAutocomplete() {
        this.autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('suggest-branch-address')),
            {types: ['geocode']}
        );
        this.autocompleteLsr = this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
    }

    fillInAddress() {
        const { newBranch } = this.state;
        let place = this.autocomplete.getPlace();
        if (place && place.formatted_address) {
            this.setState({newBranch: {...newBranch, address: place.formatted_address}});
            this.selectedAddress = place.formatted_address;
            setAddressComponents(place, this.addressComponents);
        }
    }

    _removeBranch(i) {
        let offices = this.props.employer.peripheral_offices;
        let removeOffice = offices.splice(i, 1)[0];
        this.props.handleSubmit('branches', {remove_office: removeOffice});
    }

    render(){
        const { showBranchForm, filteredOffices, selectedCity } = this.state;
        const { peripheral_offices } = this.props.employer;
        const officesList = filteredOffices ? filteredOffices : peripheral_offices;
        return (
            <div className={s.branchesListWrapper}>
                { peripheral_offices && peripheral_offices.length > 1 && //show filterbar only if there are more than 1 item
                    <div className={s.branchFilterBar}>
                        <div className={s.branchFilterBar__searchFieldWrapper}>
                            <SearchField
                                placeholder={gettext("Знайти представництво...")}
                                handleChange={(e) => { this.setState({filterQuery: e.target.value}, () => {this._filterOffices()}) }}
                            />
                        </div>
                        <div className={s.branchFilterBar__filterWrapper}>
                            <FilterSelect
                                placeholder={gettext("Оберіть місто")}
                                options={ [{value: 'all', label: gettext('Всі міста')}, ...this.state.cityOptions] }
                                handleChange={(selectedCity) => { this.setState({selectedCity}, () => { this._filterOffices() }) }}
                                value={ selectedCity }
                            />
                        </div>
                    </div>
                }
                {
                    !showBranchForm &&
                    <LayerOpener
                        label={gettext("+ Додати представництво")}
                        handleClick={(e) => {this.setState({showBranchForm: true, errors: {}})}}
                    />
                }
                {
                    showBranchForm && this._renderBranchForm()
                }
                {
                    peripheral_offices && peripheral_offices.length > 0 &&

                    <ul className={s.branchesList}>
                        <li className={s.branchesList__item + ' ' + s.branchesList__titleRow}>
                            <div className={s.branchesList__branchTitle}>{gettext('Назва')}</div>
                            <div className={s.branchesList__branchAddress}>{gettext('Адреса')}</div>
                            <div className={s.branchesList__itemAction}/>
                        </li>
                        { officesList.map((office, i) => {
                                return (
                                    <li className={s.branchesList__item} key={'office-' + i}>
                                        <div className={s.branchesList__branchTitle}>{office.office_name}</div>
                                        <div className={s.branchesList__branchAddress}>
                                            {/*<span className={s.branchAddress__city}>{ office.city }, </span>*/}
                                            <span className={s.branchAddress__address}>{office.address}</span>
                                        </div>
                                        <a
                                            className={s.branchesList__itemAction}
                                            onClick={ () => { this._removeBranch(i) }}
                                        >
                                            <i className="icon-cancel"/>
                                        </a>
                                    </li>
                                )
                            })
                        }


                    </ul>
                }
            </div>
        )
    }
}
