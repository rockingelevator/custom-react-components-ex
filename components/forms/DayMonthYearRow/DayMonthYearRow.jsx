import React, { Component } from 'react';
import { months, month_days, youngAge, oldAge } from '../../../constants';
import Select from '../../forms/Select';

import s from './DayMonthYearRow.css';


export default class DayMonthYearRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bDay: null,
            bMonth: null,
            bYear: null,
        };
        let yearToday = new Date().getUTCFullYear();
        this.startYear = yearToday - youngAge;
        this.endYear = yearToday - oldAge;
        this._handleDayChange = this._handleDayChange.bind(this);
        this._handleMonthChange = this._handleMonthChange.bind(this);
        this._handleYearChange = this._handleYearChange.bind(this);
    }

    componentWillReceiveProps(newProps){
        if(!this.state.bDay) {
            this.setState({
                bYear: newProps.year,
                bMonth: newProps.month,
                bDay: newProps.day,
            });
        }
    }

    componentWillMount(){
        const { year, month, day } = this.props;
        this.setState({
            bYear: year,
            bMonth: month,
            bDay: day,
        });
    }

    _lengthDays(date){
        let bMonth = date.bMonth || this.state.bMonth;
        let bYear = date.bYear || this.state.bYear;
        let lengthDays = 31;
        if (bMonth) {
          lengthDays = month_days[bMonth];
          if (bMonth === 1 && !(bYear % 4)) {
            lengthDays++
          }
        }
        return lengthDays;
      }

    _handleDateChange(value){
        let lengthDays;
        this.setState(value);
        lengthDays = this._lengthDays(value);
        if (this.props.day > lengthDays) {
          this.setState({bDay: lengthDays});
        } else {
            lengthDays = this.props.day;
        }
        return lengthDays;
    }

    _generateDayOptions(){
        let options = [];
        let lengthDays = this._lengthDays({bMonth: 0, bYear: 0});
        for (let i = 1; i < lengthDays + 1; i++) {
            options.push({label: i, value: i});
        }
        return options;
    }

    _generateMonthOptions(){
        let startMonth = 0;
        let endMonth = 11;
        let bYear = this.state.bYear;
        let bMonth = this.state.bMonth;

        if (bYear && bYear == this.startYear) {
            endMonth = new Date().getUTCMonth();
            if (bMonth && bMonth > endMonth) {
                bMonth = null;
            }
        } else if (bYear && bYear == this.endYear) {
            startMonth = new Date().getUTCMonth();
            if (bMonth && bMonth < startMonth) {
                bMonth = null;
            }
        }

        let options = [];
        for (let i = startMonth; i <= endMonth; i++) {
            options.push({label: months[i], value: i});
        }
        return options;
    }

    _generateYearOptions(){
        let options = [];
        for (let i = this.startYear; i >= this.endYear; i--) {
            options.push({label: i, value: i});
        }
        return options;
    }

    _handleDayChange(event) {
        this.props.handleChange({bDay: event.value});
    }

    _handleMonthChange(event) {
        let month = event.value;
        let bDay = this._handleDateChange({bMonth: month});
        this.props.handleChange({bMonth: month, bDay: bDay});
    }

    _handleYearChange(event) {
        let year = event.value;
        let bDay = this._handleDateChange({bYear: year});
        this.props.handleChange({bYear: year, bDay: bDay});
    }

    render() {
        let {day, month, year, errors} = this.props;
        return (
            <div className='groupSelects'>
                <label className='inputLabel inputLabel_default'>{gettext('День народження')}</label>
                <Select
                    label=""
                    name="day"
                    value={day}
                    options={this._generateDayOptions()}
                    handleChange={this._handleDayChange}
                    clearable={false}
                    placeholder={gettext("День")}
                    searchable={false}
                />
                <Select
                    label=""
                    name="month"
                    value={month}
                    options={this._generateMonthOptions()}
                    handleChange={this._handleMonthChange}
                    clearable={false}
                    placeholder={gettext("Мicяць")}
                />
                <Select
                    label=""
                    name="year"
                    value={year}
                    options={this._generateYearOptions()}
                    handleChange={this._handleYearChange}
                    clearable={false}
                    placeholder={gettext("Рік")}
                />
                {
                    errors &&
                    <ul className="errorList">
                        {
                            errors.map((error, i) => {
                                return (
                                    <li key={"error-" + i}>{error}</li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        )
    }
}
