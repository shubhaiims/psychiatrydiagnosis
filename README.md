# ICD-11 Psychiatry Diagnostic Interview

Static, GitHub Pages-ready clinical interview support app for structured psychiatric assessment.

This repository does not include copied SCID-5-RV, DSM-5-TR, or other proprietary diagnostic manual text. The included interview is a semi-structured ICD-11 CDDR-adapted framework with original clinician-facing prompts, probes, coding anchors, skip logic, and rule-based diagnostic review.

The design is inspired by the general method of semi-structured diagnostic interviewing: modules, stem questions, optional probes, ratings, skip rules, diagnostic hierarchy, and final formulation. It is not an official SCID-5, WHO, APA, or DSM product.

## What It Does

- Presents a stepwise clinician interview.
- Branches questions based on prior answers.
- Shows stem questions, suggested clinician probes, and coding anchors.
- Tracks safety flags and domain scores.
- Shows rule-based diagnostic signals.
- Produces a copyable and printable clinician summary.
- Stores responses locally in the browser only.

## Local Preview

Use a local web server so the JSON data files load correctly:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/
```

## Data Files

Interview modules live in:

```text
data/interviews/
```

Register each module in:

```text
data/interviews/index.json
```

Each interview file supports:

- `stages`: clinician workflow sections.
- `questions`: `single`, `multi`, `text`, or `textarea` items.
- `probes`: optional clinician follow-up prompts.
- `ratingAnchors`: optional coding anchors shown beside the question.
- `diagnosticTargets`: ICD-11 diagnostic areas reviewed by the item.
- `visibleIf`: branching rules.
- `score`: domain scoring attached to options.
- `alerts`: safety or clinical-priority flags.
- `rules`: diagnostic signal logic.

## Sources And License

The interview content adapts concepts from:

- WHO, *Clinical descriptions and diagnostic requirements for ICD-11 mental, behavioural and neurodevelopmental disorders (CDDR)*: https://www.who.int/publications/i/item/9789240077263
- License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 IGO: https://creativecommons.org/licenses/by-nc-sa/3.0/igo/

Changes were made. The app must be used non-commercially unless you replace the content or obtain appropriate permission, and adaptations should follow the same license terms. No WHO endorsement is implied.

## Deployment

The included GitHub Actions workflow deploys this static site to GitHub Pages on every push to `main`.

Expected public URL after Pages is enabled:

```text
https://shubhaiims.github.io/psychiatrydiagnosis/
```

If the first deployment does not appear, open the repository on GitHub, go to `Settings > Pages`, and set the source to `GitHub Actions`.

## Clinical And Legal Notes

This tool is for qualified clinician support only. It does not replace clinical judgment, emergency protocols, informed consent, supervision, medical records policy, or licensed diagnostic manuals.

Do not enter identifiable patient data unless the deployment, hosting, access control, consent process, and storage practices meet the privacy and security rules that apply to your setting.
