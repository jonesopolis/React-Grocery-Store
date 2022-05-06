export default function Home() {
  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <h1 className="display-1">Welcome to David's Grocery! {process.env.NEXT_PUBLIC_TEST}</h1>
      </div>
    </>
  );
}
