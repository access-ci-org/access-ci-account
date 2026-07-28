import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import DomainValidationResponse from "@/components/domain-validation-response";
import { renderWithProviders, makeDomainResponse } from "@/test/utils";

describe("DomainValidationResponse", () => {
  it("shows the ineligible message when domain is null", () => {
    renderWithProviders(<DomainValidationResponse domain={null} />);
    expect(
      screen.getByText(/is not eligible for ACCESS/),
    ).toBeInTheDocument();
  });

  it("names the domain when it is explicitly ineligible", () => {
    renderWithProviders(
      <DomainValidationResponse
        domain={makeDomainResponse({ isEligible: false, domain: "bad.com" })}
      />,
    );
    expect(
      screen.getByText(/bad\.com is not eligible for ACCESS/),
    ).toBeInTheDocument();
  });

  it("prompts to register the org when eligible but unregistered", () => {
    renderWithProviders(
      <DomainValidationResponse
        domain={makeDomainResponse({ isEligible: true, organizations: [] })}
      />,
    );
    expect(screen.getByText(/is not yet registered with ACCESS/)).toBeInTheDocument();
    expect(
      screen.getByText("fill out the organization request form"),
    ).toBeInTheDocument();
    expect(screen.getByText("open a help ticket")).toBeInTheDocument();
  });

  it("renders nothing when eligible with a known organization", () => {
    const { container } = renderWithProviders(
      <DomainValidationResponse
        domain={makeDomainResponse({ isEligible: true })}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
