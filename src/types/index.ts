export interface Children {
    children: React.ReactNode;
}

export interface ClassName {
    className?: string
}

export interface Title {
    title?: string;
}

export interface Message {
    message: string;
}

export interface IsVisible {
    isVisible: boolean;
}

export interface AlertState extends Title, Message, IsVisible {
    type: "success" | "error";
}

export interface Name {
    name: string;
}

export interface Description {
    description: string;
}

export interface Email {
    email: string;
}

interface Text {
    text: string;
}

interface ImgSrc {
    imgSrc: string;
}

interface Href {
    href: string;
}

export interface NavLink extends Name, Href {}