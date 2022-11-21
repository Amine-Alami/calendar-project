import React, { useState } from 'react'
import moment from 'moment';

export default function EventList({ events, date, props }) {

    const removeEvent = (e) => {
        props(events.filter(ev => ev.id !== e.id ));
    }

    return (
        events.filter(e => moment(e.date).isSame(date, 'year') && moment(e.date).isSame(date, 'month'))
        .map((e, i) => {
            return(
                // <p key={i}>{e.title} , {e.comment} , {e.date}</p>
                <div key={e.id} className="shadow event" >
                    <div className="event-date" >
                        <div>
                            <span className="day">{ moment(e.date).format("DD") }</span>
                            <span className="month">{ moment(e.date).format("MMM") }</span>
                        </div>
                    </div>
                    <div className="event-content" >
                        <h5>{ e.title }</h5>
                        <p>{ e.comment }</p> 
                    </div>
                    <button type="button" className="close" onClick={() => removeEvent(e) }>
                        <span className="fa fa-trash" ></span>
                    </button>
                </div>
            );
        })
    )
}
