import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { vietnamProvinces } from "@/lib/constant";

interface SubscribeModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: (location: string) => Promise<void>;
  title?: string;
  description?: string;
}

export default function SubscribeModelDialog({
  open,
  onOpenChange,
  onSubscribe,
  title,
  description,
}: SubscribeModelDialogProps) {
  const t = useTranslations("dashboard.models");
  const [location, setLocation] = useState("");
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");

  const filteredProvinces = vietnamProvinces.filter((province: string) =>
    province.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );

  const handleLocationSelect = (province: string) => {
    setLocation(province);
    setLocationPopoverOpen(false);
  };

  const handleSubscribe = async () => {
    if (!location.trim()) {
      return;
    }
    await onSubscribe(location);
    setLocation("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || t("modelDetails.subscribeTitle")}</DialogTitle>
          <DialogDescription>
            {description || t("modelDetails.subscribeDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-nowrap">
              {t("modelDetails.location")}
            </label>
            <Popover
              open={locationPopoverOpen}
              onOpenChange={setLocationPopoverOpen}
              modal={true}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  role="combobox"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {location || t("card.selectProvince")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("card.searchProvince")}
                    value={locationSearchTerm}
                    onValueChange={setLocationSearchTerm}
                  />
                  <CommandEmpty>{t("card.noProvinceFound")}</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-64">
                      {filteredProvinces.map((province) => (
                        <CommandItem
                          key={province}
                          value={province}
                          onSelect={() => handleLocationSelect(province)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div
                              className={`h-4 w-4 border rounded-sm flex items-center justify-center ${
                                location === province
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              }`}
                            >
                              {location === province && (
                                <X className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span>{province}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("modelDetails.cancel")}
          </Button>
          <Button onClick={handleSubscribe}>
            {t("modelDetails.confirmSubscribe")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
