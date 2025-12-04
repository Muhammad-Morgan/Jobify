export type ComplianceItem = {
  id: string;
  name: string;
  status: "compliant" | "pending" | "failed";
  jurisdiction: string;
};
export async function getComplianceItems(
  _page: number,
  _search?: string
): Promise<{ data: ComplianceItem[]; pageCount: number }> {
  void _page;
  void _search;
  // how the fetch should look like
  // const params = new URLSearchParams();
  // params.set('page', String(_page));
  // if (_search) params.set('search', _search);

  // const response = await fetch(
  //   `https://www.domain.com/compliance?${params.toString()}`,
  //   {
  //     cache: "no-store",
  //   }
  // );
  // if (!response.ok) throw new Error("Failed to fetch");
  // const { data, pageCount } = await response.json();
  const data: ComplianceItem[] = [
    {
      id: "1",
      name: "Policy A",
      status: "compliant",
      jurisdiction: "EU",
    },
    {
      id: "2",
      name: "Policy B",
      status: "pending",
      jurisdiction: "US",
    },
  ];
  const pageCount = 1;
  return { data, pageCount };
}
