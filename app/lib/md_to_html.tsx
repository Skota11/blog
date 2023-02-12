import sanitize from "https://esm.sh/sanitize-html@2.7.0";
import {marked} from 'https://esm.sh/marked@4.0.17"';

export default function MdToHtml(markdownText)  {
    const parsed = marked(markdownText);
    // HTML をサニタイズする
    const parsedContent = sanitize(parsed);

    return parsedContent
};