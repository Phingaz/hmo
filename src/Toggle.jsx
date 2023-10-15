/* eslint-disable react/prop-types */
function Toggle({ state, setState }) {
  return (
    <div className="flex flex-col justify-center items-center ">
      <div
        className="md:w-14 md:h-7 w-12 h-6 flex items-center bg-primary rounded-full p-1 cursor-pointer t hover:bg-secondary"
        onClick={() => {
          setState(!state);
        }}
      >
        <div
          className={`aspect-square h-4 md:h-5 w-4 md:w-5 rounded-full shadow-md transform duration-300 ease-in-out ${
            state
              ? "transform md:translate-x-7 translate-x-6 bg-white"
              : "bg-primary300"
          }`}
        ></div>
      </div>
    </div>
  );
}

export default Toggle;
