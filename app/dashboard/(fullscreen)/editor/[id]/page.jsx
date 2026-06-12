import RaffleEditor from "@/components/RaffleEditor";

export const metadata = {
  title: "Editor de sorteio — TironiDraws",
};

export default function EditorPage() {
  return (
    <div className="editor-page">
      <RaffleEditor />
    </div>
  );
}
