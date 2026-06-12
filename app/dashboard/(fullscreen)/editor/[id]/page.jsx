import RaffleEditor from "@/components/editor/RaffleEditor";

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
