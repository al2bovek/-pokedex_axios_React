export const ThingCard = ({ image, title, status}) => {
    return (
        <div>
            <img src={image} alt={title} />
            <p>{title}</p>
            <p>{status}</p>
        </div>
    )
}