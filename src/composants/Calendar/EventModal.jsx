export default EventModal = () => {
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
                <button type="submit" className="btn btn-success" onClick={this.saveEvent()}>Enregistrer</button>
            </div>
        </form>
    );
}