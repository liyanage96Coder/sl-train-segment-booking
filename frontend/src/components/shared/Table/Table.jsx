import * as S from "./styles.js";

export default function Table ({ columns, rows, rowKey = "id", emptyMessage = "No data yet." }) {
    const getKey = (row) =>
        typeof rowKey === "function" ? rowKey(row) : row[rowKey];

    return (
        <S.TableWrapper>
            <S.StyledTable>
                <S.Thead>
                    <tr>
                        {columns.map((col) => (
                            <S.Th key={col.key} style={col.width ? { width: col.width } : undefined}>
                                {col.header}
                            </S.Th>
                        ))}
                    </tr>
                </S.Thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <S.EmptyRow colSpan={columns.length}>{emptyMessage}</S.EmptyRow>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <S.Tr key={getKey(row)}>
                                {columns.map((col) => (
                                    <S.Td key={col.key}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </S.Td>
                                ))}
                            </S.Tr>
                        ))
                    )}
                </tbody>
            </S.StyledTable>
        </S.TableWrapper>
    );
}