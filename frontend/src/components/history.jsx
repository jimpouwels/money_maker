export default function History({ history }) {

    return (
        <div className='Totals-container'>
            {history.clicks.map((click, index) => {
                return <p key={`item-${index}`}>{click}</p>
            })}
        </div>
    );
}