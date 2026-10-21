import Sidebar from "../../components/docs/Sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (<div className="docs"><Sidebar /><div className="d-body">{children}</div></div>);
}
