import AllPermittedType from "@/component/admin/systemConfig/allPermittedType";
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 place-content-center items-center bg-white shadow-md h-screen">
      <h1 className="text-3xl font-bold text-center">Sample</h1>
      <AllPermittedType />
    </div>
  );
}
