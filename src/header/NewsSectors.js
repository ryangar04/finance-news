export default function NewsSectors(prop) {

    const handleChange = () => {
        prop.setNewsQuery(prop.sector)
    }

    return (
        <button className="sector-button" onClick={handleChange}>{prop.sector}</button>
    )
}