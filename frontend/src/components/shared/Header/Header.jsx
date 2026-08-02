import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import * as S from "./styles.js";


export default function Header({ title, subtitle, addNewPath, addNewLabel = "Add New" }) {
    const navigate = useNavigate();

    return (
        <S.HeaderWrapper>
            <S.TitleGroup>
                <S.Title>{title}</S.Title>
                {subtitle && <S.Subtitle>{subtitle}</S.Subtitle>}
            </S.TitleGroup>

            {addNewPath && (
                <S.AddButton type="button" onClick={() => navigate(addNewPath)}>
                    <Plus size={16} />
                    {addNewLabel}
                </S.AddButton>
            )}
        </S.HeaderWrapper>
    );
}