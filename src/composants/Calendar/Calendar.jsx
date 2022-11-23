import React from 'react';
import moment from 'moment';
import SkyLight from 'react-skylight';
import EventList from './EventList';
import EventModal from './EventModal';
import './Calendar.scss';


const LOCAL_STORAGE_KEY = "events";

export default class Calendar extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            dateContext: moment(),
            showMonthPopup: false,
            selectedDay: null,
            events: []
        }
        // Load events from local storage if exists
        const events = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (events) {
            this.state.events = events;
        }
    }

    weekdaysShort = moment.weekdaysShort();
    months = moment.months(true);

    // return selected month formated
    year = () => {
        return this.state.dateContext.format("Y");
    }

    // return selected month formated
    month = () => {
        return this.state.dateContext.format("MMMM");
    }

    // return number of days in selected month
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    
    // return current day as string
    currentDay = () => {
        return this.state.dateContext.format("DD");
    }

    // check if we are in the current year and month
    currentYearAndMonth = () => {
        if(moment().format("MM") === this.state.dateContext.format("MM")  &&  moment().format("YYYY") === this.state.dateContext.format("YYYY")) {
            return true;
        }
        return false;
    }

    // return current date
    selectedDate = () => {
        let current = this.year() + "-" + this.state.dateContext.format("MM") + "-" + this.state.selectedDay
        return moment(current).format('YYYY-MM-DD');
    }

    // return number of empty days before start of the month
    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');
        return firstDay;
    }
    

    /* ****************************** Navigation ******************************* */
    /* ********** Year *********** */

    YearNav = () => {
        return (
            <div>
                {
                    this.state.showYearNav ?
                    <input
                    defaultValue = {this.year()}
                    className="editor-year"
                    ref={(yearInput) => { this.yearInput = yearInput}}
                    onKeyUp= {(e) => this.onKeyUpYear(e)}
                    onChange = {(e) => this.onYearChange(e)}
                    type="number"
                    size="4"
                    placeholder="year"/>
                    :
                    <span
                        className="label-year"
                        onDoubleClick={(e)=> { this.showYearInput()}}>
                        {this.year()}
                    </span>
                }
            </div>
        );
    }

    prevYear = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "year");
        this.setState({
            dateContext: dateContext
        });
    }

    nextYear = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "year");
        this.setState({
            dateContext: dateContext
        });
    }

    setYear = (year) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        })
    }

    showYearInput = () => {
        this.setState({
            showYearNav: true
        });
    }
    
    onYearChange = (e) => {
        this.setYear(e.target.value);
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    }

    onKeyUpYear = (e) => {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e.target.value);
            this.setState({
                showYearNav: false
            })
        }
    }
    
    /* ********** Month *********** */

    MonthNav = () => {
        return (
            <div>
                <span className="label-month"
                    onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
                    {this.month()}
                    {this.state.showMonthPopup &&
                        <this.SelectList data={this.months} />
                    }
                </span>
            </div>
        );
    }
    
    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
    }

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
    }
    
    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    }

    onSelectChange = (e, data) => {
        this.setMonth(data);
        this.props.onMonthChange && this.props.onMonthChange();
    }

    SelectList = (props) => {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                    <span className='month' onClick={(e)=> {this.onSelectChange(e, data)}}>
                        {data}
                    </span>
                </div>
            );
        });

        return (
            <div className="month-popup">
                {popup}
            </div>
        );
    }

    onChangeMonth = (e, month) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }
    /* ****************************** ********* ******************************* */

    onDayClick = (e, day) => {
        this.setState({
            selectedDay: day
        }, () => {
            this.removeSelected();
            e.target.classList.add('selected-day');
            this.simpleDialog.show();
        });
    }

    removeSelected = () => {
        let days = document.getElementsByClassName('selected-day');
        for (let i = 0; i < days.length; i++) {
            days[i].classList.remove('selected-day');
        }
    }

    render() {
        this.removeSelected();

        // Map the weekdays
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <div key={day} className="week-day">{day}</div>
            )
        });

        // Map empty slots
        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(
                <div key={i * 80} className="emptySlot">
                    {""}
                </div>
            );
        }

        // Map days
        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            // let className = (d == this.currentDay() ? "day current-day": "day");
            let className = (d == this.currentDay() && this.currentYearAndMonth() ? "day current-day": "day");
            // let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
            daysInMonth.push(
                <div key={d} className={ className } onClick={(e)=>{ this.onDayClick(e, d) }}>
                    <span>{d}</span>
                </div>
            );
        }

        // Map all rows
        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];
        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        // Map each week
        let weeksContent = rows.map((d, i) => {
            return (
                <div className="week" key={i*100}>
                    {d}
                </div>
            );
        })

        const updateLocalStorage = (data) => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }

        const setEvents = (data) => {
            this.setState({events: data});
            this.simpleDialog.hide();
            updateLocalStorage(data);
        }

        return (
            <div className="container" style={this.style}>
                <div className="calendar shadow p-3">
                    <div className="calendar-header">
                        {/* YEAR */}
                        <div className="year-container mb-0">
                            <i className="prev fa fa-fw fa-chevron-left"
                                onClick={(e)=> {this.prevYear()}}>
                            </i> 
                            <this.YearNav/>
                            <i className="next fa fa-fw fa-chevron-right"
                                onClick={(e)=> {this.nextYear()}}>
                            </i>
                        </div>

                        {/* MONTH */}
                        <div className="month-container mb-0">
                            <i className="prev fa fa-fw fa-chevron-left"
                                onClick={(e)=> {this.prevMonth()}}>
                            </i> 
                            <this.MonthNav/>
                            <i className="next fa fa-fw fa-chevron-right"
                                onClick={(e)=> {this.nextMonth()}}>
                            </i>
                        </div>
                    </div>

                    {/* EVENTS */}
                    <div className="events mb-3 mt-3">
                        <EventList events={this.state.events} date={this.state.dateContext} props={ setEvents }/>

                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref}>
                            <EventModal date={this.selectedDate()} events={this.state.events} props={ setEvents }/> 
                        </SkyLight>
                    </div>

                    {/* CALENDAR */}
                    <div className="calendar-body">
                        <div className="day-names ">
                            {weekdays}
                        </div>
                        <div className="calendar-content">
                            {weeksContent} 
                        </div>
                        
                    </div>
                </div>

            </div>

        );
    }
}
