import { TrainFront, Mail, Phone, MapPin,  } from "lucide-react";
import * as S from "./styles";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <S.FooterWrapper>
            <S.FooterGrid>
                <S.Column>
                    <S.Brand>
                        <TrainFront size={20} />
                        LankaRail
                    </S.Brand>
                    <S.BrandText>
                        Reserve your seat on Sri Lanka's most celebrated scenic train
                        journeys — fast, fair, and fully seat-mapped.
                    </S.BrandText>
                    <S.SocialRow>
                        <S.SocialIconLink href="#" aria-label="Facebook">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H17V4.9c-.4-.1-1.4-.2-2.7-.2-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.8v8h3.7z" />
                            </svg>
                        </S.SocialIconLink>
                        <S.SocialIconLink href="#" aria-label="Instagram">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="5"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="4"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <circle
                                    cx="17.5"
                                    cy="6.5"
                                    r="1"
                                    fill="currentColor"
                                />
                            </svg>
                        </S.SocialIconLink>
                        <S.SocialIconLink href="#" aria-label="Twitter">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.9 2H22l-6.77 7.74L23 22h-6.18l-4.84-6.32L6.4 22H3.3l7.24-8.28L1 2h6.34l4.38 5.79L18.9 2Zm-1.08 18h1.72L6.24 3.9H4.4L17.82 20Z" />
                            </svg>
                        </S.SocialIconLink>
                    </S.SocialRow>
                </S.Column>

                <S.Column>
                    <S.ColumnTitle>Quick Links</S.ColumnTitle>
                    <S.FooterLink href="/book_seat">Book a Seat</S.FooterLink>
                    <S.FooterLink href="#">My Bookings</S.FooterLink>
                    <S.FooterLink href="#">Train Schedules</S.FooterLink>
                    <S.FooterLink href="#">Fare Information</S.FooterLink>
                </S.Column>

                <S.Column>
                    <S.ColumnTitle>Support</S.ColumnTitle>
                    <S.FooterLink href="#">Help Center</S.FooterLink>
                    <S.FooterLink href="#">Terms of Service</S.FooterLink>
                    <S.FooterLink href="#">Privacy Policy</S.FooterLink>
                    <S.FooterLink href="#">Refund Policy</S.FooterLink>
                </S.Column>

                <S.Column>
                    <S.ColumnTitle>Contact</S.ColumnTitle>
                    <S.ContactRow>
                        <Phone size={15} />
                        <span>+94 11 234 5678</span>
                    </S.ContactRow>
                    <S.ContactRow>
                        <Mail size={15} />
                        <span>support@lankarail.lk</span>
                    </S.ContactRow>
                    <S.ContactRow>
                        <MapPin size={20} />
                        <span>Colombo Fort Railway Station, Colombo 01</span>
                    </S.ContactRow>
                </S.Column>
            </S.FooterGrid>

            <S.Divider />

            <S.BottomRow>
                <S.Copyright>© {year} LankaRail. All rights reserved.</S.Copyright>
                <S.BottomLinks>
                    <S.FooterLink href="#">Terms</S.FooterLink>
                    <S.FooterLink href="#">Privacy</S.FooterLink>
                </S.BottomLinks>
            </S.BottomRow>
        </S.FooterWrapper>
    );
}