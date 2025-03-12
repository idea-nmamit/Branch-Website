import NeuralNetwork from "@/components/NeuralNetwork";

export default function Page() {
  return (
    <div className="relative">
      <NeuralNetwork />
      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
        Interactive Neural Network
      </div>
    </div>
  );
}
