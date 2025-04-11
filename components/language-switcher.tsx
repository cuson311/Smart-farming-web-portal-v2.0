"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobeIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  lang: string;
  turnOnLanguages: (lang: string) => void;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher({
  lang,
  turnOnLanguages,
}: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-1 px-2">
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden md:inline-block">
            {languages.find((l) => l.code === lang)?.nativeName}
          </span>
          <span className="inline-block md:hidden">
            {languages.find((l) => l.code === lang)?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuRadioGroup value={lang} onValueChange={turnOnLanguages}>
          {languages.map((language) => (
            <DropdownMenuRadioItem
              key={language.code}
              value={language.code}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-base">{language.flag}</span>
                  <span>{language.nativeName}</span>
                </div>
                {lang === language.code && (
                  <CheckIcon className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
