import SpinnerImage from "../assets/spinner.svg";

const Spinner = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <img src={SpinnerImage} alt="loading" />
        </div>
    )
}

export default Spinner