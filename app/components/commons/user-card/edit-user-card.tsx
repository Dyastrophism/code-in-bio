"use client";

import { ArrowUpFromLine, UserPen } from "lucide-react";
import Modal from "../../ui/modal";
import { startTransition, useState } from "react";
import TextInput from "../../ui/text-input";
import TextArea from "../../ui/text-area";
import Button from "../../ui/button";
import { compressFiles, handleImageInput, triggerImageInput } from "@/app/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { saveProfile } from "@/app/actions/save-profile";
import { ProfileData } from "@/app/server/get-profile-data";

export default function EditUserCard({
    profileData
}: {
    profileData?: ProfileData;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [yourName, setYourName] = useState(profileData?.name || "");
    const [yourDescription, setYourDescription] = useState(profileData?.description || "");

    const router = useRouter();
    const { profileId } = useParams();

    async function handleSaveProfile() {
        setIsSavingProfile(true);
        
        const imagesInput = document.getElementById("profile-pic-input") as HTMLInputElement;

        if(!imagesInput.files) return;

        if(!profileId) return;

        const compressedFile = await compressFiles(Array.from(imagesInput.files));

        const formData = new FormData();
        formData.append("profileId", profileId as string);
        formData.append("profilePic", compressedFile[0]);
        formData.append("yourName", yourName);
        formData.append("yourDescription", yourDescription);

        await saveProfile(formData);

        startTransition(() => {
            setIsOpen(false);
            setIsSavingProfile(false);
            router.refresh();
        });
    }

    return(
        <>
            <button
                onClick={() => setIsOpen(true)}
            >
                <UserPen />
            </button>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="bg-background-primary p-8 rounded-[20px] flex flex-col gap-10 justify-between">
                    <p className="text-white font-bold text-xl">
                        Editar perfil
                    </p>
                    <div className="flex gap-10">
                        <div className="flex flex-col gap-3 items-center text-xs">
                            <div className="w-[100px] h-[100px] rounded-xl bg-background-tertiary overflow-hidden">
                                { profilePic ? (
                                <img 
                                    src={profilePic} 
                                    alt="Profile Picture" 
                                    className="object-center object-cover"
                                /> ) : (
                                <button 
                                    className="w-full h-full"
                                    onClick={() => triggerImageInput("profile-pic-input")}    
                                >
                                    100x100
                                </button>
                                )}
                            </div>
                            <button 
                                className="text-white flex items-center gap-2"
                                onClick={() => triggerImageInput("profile-pic-input")}    
                            >
                                <ArrowUpFromLine className="size-4" />
                                <span>Adicionar foto</span>
                            </button>
                            <input 
                                id="profile-pic-input" 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => setProfilePic(handleImageInput(e))} 
                            />
                        </div>
                        <div className="flex flex-col gap-4 w-[293px]">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="your-name" className="text-white font-bold">
                                    Seu nome
                                </label>
                                <TextInput 
                                    id="your-name" 
                                    placeholder="Digite seu nome"
                                    value={yourName}
                                    onChange={(e) => setYourName(e.target.value)}    
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="your-description">
                                    Descrição
                                </label>
                                <TextArea 
                                    id="your-description" 
                                    className="h-36"
                                    placeholder="Fale um pouco sobre você"
                                    value={yourDescription}
                                    onChange={(e) => setYourDescription(e.target.value)}    
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 justify-end">
                        <button 
                            className="font-bold text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            Voltar
                        </button>
                        <Button
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile}
                        >
                            Salvar
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}