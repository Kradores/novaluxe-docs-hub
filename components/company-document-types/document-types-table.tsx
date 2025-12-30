import DeleteTypeButton from "./delete-type-button";

export type DocumentType = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  data: DocumentType[];
};

export default function DocumentTypesTable({ data }: Props) {
  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground">No document types found.</p>
    );
  }

  return (
    <div className="rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Created</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2 font-medium">{item.name}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-right">
                <DeleteTypeButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
