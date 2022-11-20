import React from 'react'

export default function EventList({ events }) {
  return (
    events.map(e => {
        <div>
            <p>{e.title} , {e.comment} , {e.date}</p>
            <br />
        </div>
    })
  )
}
