import { useRef} from "react";
import {v1 as uuid} from "uuid"; 

export default function EventModal ({ events, date, props }) {

    // const [events] = useState([]);
    const title = useRef();
    const comment = useRef();
    const evDate = useRef();

    function saveEvent() {

        const ev = {
            id: uuid(),
            title: title.current.value,
            comment: comment.current.value,
            date: evDate.current.value
        }
        events.push(ev);
        props(events);
    }

    return (
        <div className="event-modal">
            <div className="event-header">
                <h4 className="modal-title">Ajouter un évenement</h4>
            </div>
            <div className="event-body">
                <input ref={title} name="title" type="text" className="form-control" placeholder="Titre"/>
                <textarea ref={comment} name="comment" type="text" rows="5" className="form-control" placeholder="Commentaire"/>
                <input ref={evDate} name="date" type="date" className="form-control" value={ date } readOnly />
            </div>
            <div className="event-footer">
                <button type="button" className="btn btn-success" onClick={ saveEvent }>Enregistrer</button> 
            </div>
        </div>
    );
}