import View from "@ioc:Adonis/Core/View";
import feather from "feather-icons";

View.global("icon", function(iconName: string, attrs: any) {
  return feather.icons[iconName]?.toSvg(attrs ?? undefined);
});

View.global("nullableStr", function(str: string) {
  return str == null ? "undefined" : `"${str}"`;
})
