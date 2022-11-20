import React from 'react';
import moment from 'moment';
import SkyLight from 'react-skylight';
// import uuid from 'uuid';
import EventList from './EventList';
import './Calendar.scss';

/**
 * TODO:
 *      translate months and days
 *      
 */

export default class Calendar extends React.Component {
    state = {
        dateContext: moment(),
        today: moment(),
        showMonthPopup: false,
        showYearPopup: false,
        selectedDay: null,
        events: []
    }

    constructor(props){
        super(props);
        this.state.events = [
            {title: 'event1', comment: 'comment1', date: new Date()},
            {title: 'event2', comment: 'comment2', date: new Date()}
        ]
    }

    weekdays = moment.weekdays(true); //["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"]
    weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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



    // return current date
    selectedDate = () => {
        let current = this.year() + "-" + this.state.dateContext.format("MM") + "-" + this.state.selectedDay
        return moment(current).format('YYYY-MM-DD');
    }

    // return number of empty days before start of the month
    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
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
        this.props.onPrevYear && this.props.onPrevYear();
    }

    nextYear = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "year");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextYear && this.props.onNextYear();
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
            <span className="label-month"
                onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonthPopup &&
                    <this.SelectList data={this.months} />
                }
            </span>
        );
    }
    
    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
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
            console.log("SELECTED DATE: ", this.selectedDate());
            this.simpleDialog.show();
        });

        // this.props.onDayClick && this.props.onDayClick(e, day);
    }

    saveEvent() {
        // e.preventDefault();
        // const form = event.target;
        // const data = new FormData(form);
        // console.log(data);
        // const newEvent = {
        //   id: uuid(),
        //   title: this.state.name,
        //   comment: this.state.img,
        //   date: 
        // }
    }

    EventModal = () => {
        return (
            <form className="event-modal" onSubmit={this.saveEvent}>
                <div className="event-header">
                    <h4 className="modal-title">Ajouter un évenement</h4>
                </div>
                <div className="event-body">
                    <input name='title' type="text" className="form-control" placeholder="Titre"/>
                    <textarea name='comment' type="text" rows="5" className="form-control" placeholder="Commentaire"/>
                    <input name='date' type="date" className="form-control" value={this.selectedDate()}/>
                </div>
                <div className="event-footer">
                    <button type="button" className="btn btn-success" onClick={this.saveEvent()}>Enregistrer</button>
                </div>
            </form>
        );
    }

    

    render() {
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
            let className = (d == this.currentDay() ? "day current-day": "day");
            let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
            daysInMonth.push(
                <div key={d} className={className + selectedClass} onClick={(e)=>{this.onDayClick(e, d)}}>
                    <span>{d}</span>
                </div>
            );
        }

        // 
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

        let weeksContent = rows.map((d, i) => {
            return (
                <div className="week" key={i*100}>
                    {d}
                </div>
            );
        })

        return (
            <div className="container" style={this.style}>
                <div className="calendar shadow p-3">
                    <div className="calendar-header">
                
                        <div className="year-container mb-0">
                            <i className="prev fa fa-fw fa-chevron-left"
                                onClick={(e)=> {this.prevYear()}}>
                            </i> 
                            <div>
                                <this.YearNav/>
                            </div>
                            <i className="next fa fa-fw fa-chevron-right"
                                onClick={(e)=> {this.nextYear()}}>
                            </i>
                        </div>
                        
                        <div className="month-container mb-0">
                            <i className="prev fa fa-fw fa-chevron-left"
                                onClick={(e)=> {this.prevMonth()}}>
                            </i> 
                            <div>
                                <this.MonthNav/>
                            </div>
                            <i className="next fa fa-fw fa-chevron-right"
                                onClick={(e)=> {this.nextMonth()}}>
                            </i>
                        </div>
                        
                    </div>
                    <div className="events mb-3 mt-3">

                        <EventList events={this.state.events}/>

                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref}>
                            <this.EventModal/>
                        </SkyLight>
                    </div>
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
