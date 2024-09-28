export const ErrorContainer = () => {
  return (
    <div className="col-span-full">
      <div className="card flex flex-col justify-center items-center">
        <div className="w-3/4 text-center min-h-40 ct-bg-white">
          <p className="pt-8">
            Sorry we couldn't load this resource at this time. Try again later!
          </p>
        </div>
      </div>
    </div>
  );
};
